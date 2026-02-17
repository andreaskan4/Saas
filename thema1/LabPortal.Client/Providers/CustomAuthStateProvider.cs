using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;
using System.Text.Json;
using System.Net.Http.Headers;

namespace LabPortal.Client.Providers
{
    public class CustomAuthStateProvider : AuthenticationStateProvider
    {
        private readonly ILocalStorageService _localStorage;
        private readonly HttpClient _http;

        public CustomAuthStateProvider(ILocalStorageService localStorage, HttpClient http)
        {
            _localStorage = localStorage;
            _http = http;
        }
        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            string token = null;

            try
            {
                // Προσπαθούμε να διαβάσουμε το token
                token = await _localStorage.GetItemAsync<string>("authToken");
            }
            catch
            {
                // Αν σκάσει (π.χ. επειδή τρέχουμε στον Server/Prerendering), το αγνοούμε
                // και συνεχίζουμε ως Ανώνυμοι.
            }

            if (string.IsNullOrWhiteSpace(token))
            {
                // Αν δεν βρήκαμε token ή σκάσαμε, επιστρέφουμε Κενό (Ανώνυμος)
                return new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity()));
            }

            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity(ParseClaimsFromJwt(token), "jwt")));
        }

        public async Task MarkUserAsAuthenticated(string token)
        {
            await _localStorage.SetItemAsync("authToken", token);
            var authState = Task.FromResult(new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity(ParseClaimsFromJwt(token), "jwt"))));
            NotifyAuthenticationStateChanged(authState);
        }

        public async Task MarkUserAsLoggedOut()
        {
            await _localStorage.RemoveItemAsync("authToken");
            var authState = Task.FromResult(new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity())));
            NotifyAuthenticationStateChanged(authState);
        }

        private IEnumerable<Claim> ParseClaimsFromJwt(string jwt)
        {
            if (string.IsNullOrWhiteSpace(jwt)) return new List<Claim>();

            var segments = jwt.Split('.');
            if (segments.Length < 2) return new List<Claim>();

            var payload = segments[1];
            var jsonBytes = ParseBase64WithoutPadding(payload);
            var keyValuePairs = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonBytes);

            var claims = new List<Claim>();

            if (keyValuePairs != null)
            {
                foreach (var kvp in keyValuePairs)
                {
                    var key = kvp.Key;
                    var value = kvp.Value.ToString();

                    Console.WriteLine($"JWT Claim -> Key: {key}, Value: {value}");

                    if (key == "unique_name" || key == "name" || key.EndsWith("/name"))
                    {
                        claims.Add(new Claim(ClaimTypes.Name, value));
                    }
                    else if (key == "sub" || key == "id" || key.EndsWith("/nameidentifier"))
                    {
                        claims.Add(new Claim(ClaimTypes.NameIdentifier, value));
                    }
                    else
                    {
                        claims.Add(new Claim(key, value));
                    }
                }
            }

            return claims;
        }

        private byte[] ParseBase64WithoutPadding(string base64)
        {
            switch (base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
            }
            return Convert.FromBase64String(base64);
        }
    }
}
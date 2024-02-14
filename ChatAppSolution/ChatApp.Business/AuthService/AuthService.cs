using AutoMapper;
using ChatApp.Data.Models;
using ChatApp.Data.Models.ResponseModels;
using ChatApp.Data.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper, IConfiguration config)
        {
            _mapper = mapper;
            _config = config;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        public async Task<ApiResponse> AuthLogin(LoginViewModel loginViewModel)
        {
            var userExist = await _userManager.FindByEmailAsync(loginViewModel.Email);
            if (userExist == null)
            {
                return new ApiResponse
                {
                    IsSuccess = false,
                    Message = "User Doesn't Exist!"
                };
            }
            else if (await _userManager.CheckPasswordAsync(userExist, loginViewModel.Password))
            {
                var loginToken = GenerateJwtToken(userExist);
                return new ApiResponse
                {
                    IsSuccess = true,
                    Data = loginToken,
                    Message = "User LoggedIn Successfully!"
                };
            }
            else
            {
                return new ApiResponse
                {
                    IsSuccess = false,
                    Message = "Incorrect Password"
                };
            }
        }
        public async Task<ApiResponse> AuthRegister(RegistrationViewModel registrationViewModel)
        {
            var userExistByEmail = await _userManager.FindByEmailAsync(registrationViewModel.Email);
            var userExistByUsername = await _userManager.FindByNameAsync(registrationViewModel.UserName);
            if (userExistByEmail != null)
            {
                return new ApiResponse
                {
                    IsSuccess = false,
                    Message = "User with same email already exists!"
                };
            }
            else if (userExistByUsername != null)
            {
                return new ApiResponse
                {
                    IsSuccess = false,
                    Message = "User with same username already exists!"
                };
            }
            else
            {
                var user = _mapper.Map<User>(registrationViewModel);
                user.UserName = registrationViewModel.UserName.ToLower();
                user.Email = registrationViewModel.Email.ToLower();
                var result = await _userManager.CreateAsync(user, registrationViewModel.Password);
                if (result.Succeeded)
                {
                    return new ApiResponse
                    {
                        IsSuccess = true,
                        Message = "User Registered Successfully!",
                    };
                }
                return new ApiResponse
                {
                    IsSuccess = false,
                    Message = "Internal Server Error!"
                };
            }
        }

        public async Task<ApiResponse> AuthLogout()
        {
            await _signInManager.SignOutAsync();
            return new ApiResponse
            {
                IsSuccess = true,
                Message = "Logged Out Successfully"
            };
        }

        private string GenerateJwtToken(User user)
        {
            List<string> roles = _userManager.GetRolesAsync(user).Result.ToList();
            var claims = new[] {
            new Claim("name", user.UserName),
            new Claim("email", user.Email),
            new Claim("id",user.Id)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                                             _config["Jwt:Audience"],
                                             claims,
                                             expires: DateTime.Now.AddHours(3),
                                             signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

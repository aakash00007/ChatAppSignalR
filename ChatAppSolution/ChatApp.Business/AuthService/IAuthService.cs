using ChatApp.Data.Models.ResponseModels;
using ChatApp.Data.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.AuthService
{
    public interface IAuthService
    {
        Task<ApiResponse> AuthLogin(LoginViewModel loginViewModel);
        Task<ApiResponse> AuthRegister(RegistrationViewModel registrationVIewModel);
        Task<ApiResponse> AuthLogout();
    }
}

using ChatApp.Business.AuthService;
using ChatApp.Data.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public AuthController(IAuthService authService,IWebHostEnvironment webHostEnvironment)
        {
            _authService = authService;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginViewModel loginViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var result = await _authService.AuthLogin(loginViewModel);
                    if (result.IsSuccess)
                    {
                        return Ok(result);
                    }
                    return BadRequest(result);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegistrationViewModel registrationViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if(registrationViewModel.ImageFile != null && registrationViewModel.ImageFile.Length > 0)
                    {
                        var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "Resources/Images");
                        if (!Directory.Exists(uploadPath))
                        {
                            Directory.CreateDirectory(uploadPath);
                        }
                        var filePath = Path.Combine(uploadPath, registrationViewModel.ImageFile.FileName);
                        using(var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await registrationViewModel.ImageFile.CopyToAsync(stream);
                        }
                        registrationViewModel.ImageUrl = filePath;
                    }
                    var result = await _authService.AuthRegister(registrationViewModel);
                    if (result.IsSuccess)
                    {
                        return Ok(StatusCode(201, result));
                    }
                    else
                    {
                        return StatusCode(409, result);
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }
            return BadRequest();
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var result = await _authService.AuthLogout();
                if (result.IsSuccess)
                {
                    return Ok(result);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

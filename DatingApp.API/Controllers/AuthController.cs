using DatingApp.API.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Models;
using DatingApp.API.Dtos;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await _repo.UserExists(userForRegisterDto.Username))
            {
                return BadRequest("Username already existes");
            }
            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            // Below mentioend code was used with old username 
            // var userToCreate = new User
            // {
            //     Username = userForRegisterDto.Username
            // };

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);
            
            return CreatedAtRoute(nameof(UsersController.GetUser), new { id = createdUser.Id }, userToReturn);

            // return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userToReturn);

            //return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);
            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = _mapper.Map<UserForListDto>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
            });
        }
    }

    //     NOTE::::::::::  For Non-API Controllers, we need to pass [FromBody], ModelState if we comment [ApiController] at start for validations
    //     [HttpPost("register")]
    //     public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
    //     {
    //         if(!ModelState.IsValid) {
    //             return BadRequest(ModelState);
    //         }            
    //         userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
    //         if(await _repo.UserExists(userForRegisterDto.Username)) {
    //             return BadRequest("Username already existes");
    //         }
    //         var userToCreate = new User 
    //         {
    //             Username = userForRegisterDto.Username
    //         };

    //         var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
    //         return StatusCode(201);
    //     }
    // }


}
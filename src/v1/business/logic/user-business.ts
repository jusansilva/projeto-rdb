import { Container, Service, ContainerInstance } from "typedi";
import { UserDto } from "../../adapters/dtos";
import { UserRepository } from "../../adapters/repositories";
import { AuthResponse } from "../../adapters/response";
import * as  jwt from 'jsonwebtoken';
import * as  crypto from 'crypto';
import { AppEnvs } from "../../adapters/envs";
import { IUserModel } from "../../adapters/repositories/model";
require("dotenv").config();




@Service()
export class UserBusiness {
  private readonly repository: UserRepository;
  constructor(container: ContainerInstance) {
    this.repository = container.get(UserRepository);
  }

  public async logar(dto: UserDto, authorization?: string): Promise<AuthResponse> {
    try {

      if (authorization) {
        let verify;
        await jwt.verify(authorization, process.env.SECRET, function (err, decoded) {
          if (err) {
            if (dto.email) {
              const token = jwt.sign({ email: dto.email }, process.env.SECRET, {
                expiresIn: 3600 // expires in 10min
              });
              this.repository.updateToken(token, dto.email);
            }
            verify = { auth: false, message: 'User or password not found' }
          } else {
            verify = { auth: true, token: authorization };
          }
        });
        return verify;
      }
      const password =  crypto.createHash('md5').update(dto.password).digest("hex");
      const find = await this.repository.logar(dto.email, password);
      if (!find) return { auth: false, message: 'User or password not found' };


      if (find.token) {
        let jwtVerify;

        await jwt.verify(find.token, process.env.SECRET, function (err, decoded) {
          if (err) {
            const token = jwt.sign({ email: find.email }, process.env.SECRET, {
              expiresIn: "10h" // expires in 10h
            });
            this.repository.updateToken(token, dto.email);
          }
          jwtVerify = { auth: true, token: find.token };
        });
        return jwtVerify;
      } else {
        const token = jwt.sign({ email: find.email }, process.env.SECRET, {
          expiresIn: "10h" // expires in 10h
        });
        await this.repository.updateToken(token, dto.email);

        return { auth: true, token: token };
      }
    } catch (error) {
      console.log(error)
      return error
    }
  }

  public async create(dto: UserDto): Promise<UserDto> {
    try {
      const token = jwt.sign({ email: dto.email }, process.env.SECRET, {
        expiresIn: "10h" // expires in 10h
      });

      const user: UserDto = {
        nome: dto.nome,
        email: dto.email,
        password: crypto.createHash('md5').update(dto.password).digest("hex"),
        token: token
      }

      const creater = await this.repository.create(user)

      const dtoUser = this.parseDtoUser(creater);

      delete dtoUser.password;

      return dtoUser;
    } catch (error) {
      console.log(error)
      return error
    }
  }

  public parseDtoUser(model: IUserModel): UserDto {
    return {
      nome: model.nome,
      email: model.email,
      password: model.password,
      token: model.token
    }
  }

  public async auth(token: string): Promise<AuthResponse> {
    try {
      let verify;
      await jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          verify = { auth: false, message: 'Please try login' }
        } else {
          verify = { auth: true, token: token };
        }
      });
      return verify;
    } catch (error) {
      console.log(error)
      return error
    }
  }
}
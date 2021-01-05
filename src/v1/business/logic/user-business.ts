import { Container, Service, ContainerInstance } from "typedi";
import { UserDto } from "../../adapters/dtos";
import { UserRepository } from "../../adapters/repositories";
import { AuthResponse } from "v1/adapters/response";
import jwt from 'jsonwebtoken';


@Service()
export class UserBusiness {
  private readonly repository: UserRepository;
  constructor(container: ContainerInstance) {
    this.repository = container.get(UserRepository);
  }

  public async logar(dto: UserDto): Promise<AuthResponse> {
    try {
      const find = await this.repository.logar(dto.email, dto.password);
      if (!find) return { auth: false, message: 'User or passwor not found' };
      if (find.token) {
        const jwtVerify = jwt.verify(find.token, process.env.SECRET, function (err, decoded) {
          if (err) {
            const token = jwt.sign(find.email, process.env.SECRET, {
              expiresIn: 3600 // expires in 10min
            });
            this.repository.updateToken(token, dto.email);
          }
          return { auth: true, token: decoded.token };
        });
        return jwtVerify;
      } else {
        const token = jwt.sign(find.email, process.env.SECRET, {
          expiresIn: 3600 // expires in 10min
        });
        await this.repository.updateToken(token, dto.email);

        return { auth: true, token: token };
      }
    } catch (error) {
      console.log(error)
      return error
    }
  }

}
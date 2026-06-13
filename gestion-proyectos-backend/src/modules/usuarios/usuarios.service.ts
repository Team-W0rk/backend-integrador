import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EstadoUsuario } from '../../common/enums/estado.enum';
import { Usuario } from './entities/usuarios.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Omit<Usuario, 'password'>[]> {
    const usuarios = await this.usuariosRepo.find();
    return usuarios.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password: _password, ...u }) => u as Omit<Usuario, 'password'>,
    );
  }

  async findOne(id: number): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = usuario;
    return rest as Omit<Usuario, 'password'>;
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({ where: { username } });
  }

  async create(dto: CreateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    const existe = await this.findByUsername(dto.username);
    if (existe) throw new ConflictException('El nombre de usuario ya existe');

    const hash = await bcrypt.hash(dto.password, 10);
    const usuario = this.usuariosRepo.create({ ...dto, password: hash });
    const saved = await this.usuariosRepo.save(usuario);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = saved;
    return rest as Omit<Usuario, 'password'>;
  }

  async update(
    id: number,
    dto: UpdateUsuarioDto,
  ): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(usuario, dto);
    const saved = await this.usuariosRepo.save(usuario);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = saved;
    return rest as Omit<Usuario, 'password'>;
  }

  async darBaja(id: number): Promise<Omit<Usuario, 'password'>> {
    return this.update(id, { estado: EstadoUsuario.BAJA });
  }
}

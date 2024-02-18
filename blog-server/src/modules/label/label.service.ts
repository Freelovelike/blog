import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from 'src/entity/label.entity';
import { Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label) private readonly labelRepository:Repository<Label>
  ){}
  create(createLabelDto: CreateLabelDto) {
    return this.labelRepository.save(createLabelDto)
  }

  findAll() {
    return `This action returns all label`;
  }

  findOne(id: number) {
    return `This action returns a #${id} label`;
  }

  update(id: number, updateLabelDto: UpdateLabelDto) {
    return `This action updates a #${id} label`;
  }

  remove(id: number) {
    return `This action removes a #${id} label`;
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Gallery } from 'src/entity/gallery.entity';
import { Repository } from 'typeorm';

const qiniu = require('qiniu');

@ApiTags("gallery")
@Controller('gallery')
export class GalleryController {
    constructor(@InjectRepository(Gallery) private readonly galleryRepository:Repository<Gallery> ){

    }
    @Post("upload")
    upload(@Body() {url,height,width}){
        console.log("aaa");
 
        return this.galleryRepository.save({url,height,width})
    }
    @Get("list")
    getGalleryList(){
        return this.galleryRepository.find({
            where:{}
        })
    }
  @Get()
  getUploadKey() {
    const accessKey = 'JuFVE_Fn9SQ3yEXk0rhDI_RaqbpYhvn4ydQOKivH';
    const secretKey = 'Q9nwdDXxmWIETPMO-RtGnf_nlbfXXEdYPXrdSF_O';

    const bucket = 'freelike';
    const domain = 'cdn.freelike.cn';

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
    });
    var uploadToken = putPolicy.uploadToken(mac);
    return uploadToken
  }

}

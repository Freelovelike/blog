import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Article } from 'src/entity/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(article: Article): Promise<Article> {
    console.log(this.articleRepository.create(article));

    return this.articleRepository.save(article);
  }
  async getArticle(articleId: string): Promise<Article[]> {
    return this.articleRepository.find({
        where:{
            PresenterId:"1"
        }
    });
  }
  async getArticleInfo(id: string): Promise<Article> {
    console.log({id});
    
     const res=await this.articleRepository.findOne({
       //@ts-ignore
        where: { _id:new ObjectId(id) },
      });
      console.log({res});
      
    return res
  }
}

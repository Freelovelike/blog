import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleCreateDto } from 'src/dto/atticle/article.dto';
import { Article } from 'src/entity/article.entity';
import { ArticleService } from './article.service';

@ApiTags('文章接口')
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Get('list')
  getArticleList(@Query() id: Article[]) {
    console.log('aaa');

    return this.articleService.getArticle('1');
  }
  @Get('info')
  async getArticleInfo(@Query() { id }: { id: string }) {
    const data = await this.articleService.getArticleInfo(id);
    console.log({ data });
    return data;
  }
  @ApiOperation({
    summary: '创建新文章',
  })
  @Post('create')
  createaArticle(
    @Body()
    { title, content, PresenterId, category, description }: ArticleCreateDto,
  ) {
    return this.articleService.create({
      title,
      content,
      PresenterId,
      likes: 0,
      views: 0,
      deleteAt: null,
      isDelete: false,
      category,
      description,
    });
  }
  @Post('edit')
  editArticle(@Body() article) {
    return '编辑文章';
  }
  @Post('remove')
  removeArticle(@Body() id: number) {
    return '删除文章';
  }
}

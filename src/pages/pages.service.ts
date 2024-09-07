import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { Prisma } from '@prisma/client';
import { handlePrismaKnownError } from 'src/common/util/prisma-error.util';
import { PrismaService } from 'src/prisma.service';
import { UrlResponseDto } from './dto/url-response.dto';
import { UrlDto } from './dto/url.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { CometChatService } from 'src/common/comet-chat/comet-chat.service';

@Injectable()
export class PagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cometChatService: CometChatService,
  ) { }

  async findUrl(urlDto: UrlDto): Promise<UrlResponseDto> {
    const { url } = urlDto;
    if (!url) {
      return {
        url: 'url',
        status: 'unavailable',
      };
    }
    const fetched_url = await this.prisma.page.findUnique({
      where: {
        url: url,
      },
    });
    if (!fetched_url) {
      return {
        url: url,
        status: 'available',
      };
    }
    return {
      url: url,
      status: 'unavailable',
    };
  }

  async create(createPageDto: CreatePageDto) {
    try {
      const page_created = await this.prisma.page.create({
        data: createPageDto,
      });
      return page_created;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaKnownError(e);
      }
      throw e;
    }
  }

  async findAll() {
    const pages = this.prisma.page.findMany({
      where: {
        is_published: true,
      }
    });

    const ratings = this.prisma.ratings.findMany({
      where: {
        request: 'accepted',
      },
    });

    return Promise.all([pages, ratings])
      .then(([pages, ratings]) => {
        return pages.map(page => {
          const personal = page.personal_id;
          const personal_ratings = ratings.filter(rating => rating.personal_id === personal);
          const total = personal_ratings.reduce((acc, rating) => acc + rating.rating, 0);
          const average = total / personal_ratings.length;

          return {
            ...page,
            ratings: {
              total,
              average,
            },
          }
        });
      });
  }

  async findOne(url: string) {
    const page = await this.prisma.page.findUnique({
      where: {
        url: url,
      },
    });

    if (!page) {
      return null;
    }

    const personal = await this.prisma.personal.findUnique({
      where: {
        id: page.personal_id,
      },
    });

    if (!personal) {
      return page;
    }

    const ratings = await this.prisma.ratings.findMany({
      where: {
        personal_id: personal.id,
        request: 'accepted',
      },
    });

    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = total / ratings.length;

    return {
      ...page,
      cref: personal.cref,
      uid_chat: personal.uid_chat,
      city: personal.city,
      state: personal.state,
      ratings: {
        total,
        average,
      },
    }
  }

  async findOneById(id: string) {
    const page = await this.prisma.page.findUnique({
      where: {
        personal_id: id,
      },
    });

    if (!page) {
      return null;
    }
    return page
  }

  async update(updatePageDto: UpdatePageDto, file: Express.Multer.File) {
    const data = { ...updatePageDto };
    const { city, state } = data;

    delete data.token;
    delete data.city;
    delete data.state;

    try {
      const personal = await this.prisma.personal.findUnique({
        where: {
          id: updatePageDto.token,
        },
      });

      if (!personal.uid_chat || personal.uid_chat === '') {
        const user_response = await this.cometChatService.createCometChatUser({
          name: updatePageDto.page_name,
        });

        await this.prisma.personal.update({
          where: {
            id: updatePageDto.token,
          },
          data: {
            uid_chat: user_response.uuidKey,
          },
        });
      }

      if (file) {
        const base64Avatar = file.buffer.toString('base64');
        const page_updated = await this.prisma.page.update({
          where: {
            personal_id: updatePageDto.token,
          },
          data: {
            ...data,
            avatar: base64Avatar,
          },
        });
        return page_updated;
      }

      const page_updated = await this.prisma.page.update({
        where: {
          personal_id: updatePageDto.token,
        },
        data: {
          ...data,
        },
      });

      if (city !== '') {
        await this.prisma.personal.update({
          where: {
            id: updatePageDto.token,
          },
          data: {
            city,
          },
        });
      }
      if (state !== '') {
        await this.prisma.personal.update({
          where: {
            id: updatePageDto.token,
          },
          data: {
            state
          },
        });
      }

      return page_updated;

    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaKnownError(e);
      }
      throw e;
    }
  }

  async search(query: any) {
    let { name, city, state, expertises, gender, rate } = query;

    const searchConditions: any[] = [];

    // Add expertises condition if provided
    // COMPLETED
    if (expertises) {
      searchConditions.push({
        expertises: {
          hasEvery: expertises.split(','), // Split expertises into an array
        },
      });
    }

    // Add additional conditions (like name, gender, rate, etc.) if provided
    if (name) {
      searchConditions.push({
        page_name: {
          contains: name,
          mode: 'insensitive',
        },
      });
    }

    if (gender) {
      searchConditions.push({
        gender: gender,
      });
    }

    if (rate) {
      searchConditions.push({
        rate: {
          lte: parseFloat(rate),
        },
      });
    }

    console.log('searchConditions', searchConditions);

    // Fetch pages matching the search conditions
    const pages = this.prisma.page.findMany({
      where: {
        is_published: true,
        AND: searchConditions, // Ensure all conditions are combined with AND
      },
    });


    // Fetch personal data if city and state are provided
    const personal = this.prisma.personal.findMany({
      where: {
        city,
        state,
      },
    });

    // Fetch ratings that are 'accepted'
    const ratings = this.prisma.ratings.findMany({
      where: {
        request: 'accepted',
      },
    });

    // Resolve all promises (pages, personal, ratings) in parallel
    const [pagesResult, personalResult, ratingsResult] = await Promise.all([pages, personal, ratings]);
    console.log('search ', pagesResult);

    // Process pages to include their associated ratings
    const pagesWithRatings = pagesResult.map(page => {
      const personalId = page.personal_id;
      const personalRatings = ratingsResult.filter(rating => rating.personal_id === personalId);
      const totalRatings = personalRatings.reduce((acc, rating) => acc + rating.rating, 0);
      const averageRating = personalRatings.length > 0 ? totalRatings / personalRatings.length : 0;

      return {
        ...page,
        ratings: {
          total: totalRatings,
          average: averageRating,
        },
      };
    });

    return pagesWithRatings;
  }


}

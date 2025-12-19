import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.setting.findMany();
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as any);

    return { success: true, data: settingsObject };
  }

  async updateSettings(settingsData: any) {
    const updatePromises = Object.entries(settingsData).map(([key, value]) =>
      this.prisma.setting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any, type: typeof value },
      }),
    );

    await Promise.all(updatePromises);
    return { success: true, message: 'Settings updated successfully' };
  }
}

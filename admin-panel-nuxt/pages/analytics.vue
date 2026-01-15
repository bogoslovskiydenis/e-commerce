<template>
  <div>
    <h1 class="text-h4 mb-4">Аналитика</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon start>mdi-trending-up</v-icon>
            Продажи
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-grey">Здесь будут отображаться графики продаж и статистика</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon start>mdi-chart-bar</v-icon>
            Отчеты
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-grey">Различные отчеты и метрики</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-alert type="info" class="mt-4">Страница аналитики находится в разработке</v-alert>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

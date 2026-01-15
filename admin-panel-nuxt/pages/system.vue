<template>
  <div>
    <h1 class="text-h4 mb-4">Системная информация</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon start>mdi-memory</v-icon>
            Система
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Версия приложения</v-list-item-title>
                <v-list-item-subtitle>1.0.0</v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip color="success" size="small">Стабильная</v-chip>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Node.js</v-list-item-title>
                <v-list-item-subtitle>v18.0.0</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Nuxt</v-list-item-title>
                <v-list-item-subtitle>v3.13.0</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon start>mdi-network</v-icon>
            Подключения
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>API</v-list-item-title>
                <v-list-item-subtitle>http://localhost:3001</v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip color="success" size="small">Активно</v-chip>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>База данных</v-list-item-title>
                <v-list-item-subtitle>PostgreSQL</v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip color="success" size="small">Подключено</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

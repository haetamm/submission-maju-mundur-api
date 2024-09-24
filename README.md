### 1. Project Setup | Backend

```sh
copy .env.example file to .env and edit database credentials there
```

```sh
npm install
```

__Migration Table__


```sh
npx prisma migrate dev 
npx prisma migrate dev add_uuid_ids [postgres db]
```

__Database Seed__

```sh
node --experimental-modules seeders
```


### 2. Run application

```sh
npm run start
```


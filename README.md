# CPSC-559-Project

## How To Run

1. Install Docker Desktop and docker-compose
1. Clone this repo
1. Create a `.env` file in the `backend` directory and provide a `MONGO_URI` value

```
.env

#for local instance of mongodb
MONGO_URI=mongodb://root:example@database:27017/ 

OR

#for cloud instance of mongodb
MONGO_URI=mongodb+srv://bobross:IC6Fo6HF99MW84M1@bobrosstogether.j0tutdu.mongodb.net/test 
```
1. Run `docker-compose up --build -d`
    - The backend is started and exposed on port `5000`
    - The frontend is started and exposed on port `3000`
    - A MongoDB container (`database` service) is started that is exposed on port `27017`. Data is stored on the `mongo-data` volume
    - A Mongo Express container is started that is exposed on port `8081`
1. Run `docker-compose down` to bring down all the containers

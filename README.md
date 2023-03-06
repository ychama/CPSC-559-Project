# CPSC-559-Project

## How To Run

1. Install Docker Desktop and docker-compose
1. Clone this repo
1. go to `docker-compose.yml` and modify the values as needed (environments variables, ports, etc.)
1. Run `docker-compose up --build -d`
    - The backend is started and exposed on port `5000`
    - The frontend is started and exposed on port `3000`
    - A MongoDB container (`database` service) is started that is exposed on port `27017`. Data is stored on the `mongo-data` volume (on your machine's filesystem)
    - A Mongo Express container is started that is exposed on port `8081`
    - Run `docker-compose down` to bring down all the containers
1. Go to the mongo-express service (`localhost:8081`) to manage the MongoDB database and add SVGs using their JSON representation (sunflower/ironma/spiderman).
```
sunflower SVG

{
   "_id": ObjectID(),
   "templateName":"flower1",
   "paths":[
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
         "svgTransform":"matrix(4.171,0,0,4.171,-1189.9,-1622.6)",
         "svgFill":"#4612c9",
         "_id": ObjectID()
      },
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
         "svgTransform":"matrix(1.9267,-3.6993,3.6993,1.9267,-2300.4,940)",
         "svgFill":"#4612c9",
         "_id": ObjectID()
      },
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
         "svgTransform":"matrix(-2.2819,-3.4915,3.4915,-2.2819,-619.15,3078.5)",
         "svgFill":"#4612c9",
         "_id": ObjectID()
      },
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
         "svgTransform":"matrix(-4.168 .15789 -.15789 -4.168 2006.7 2709.8)",
         "svgFill":"#4612c9",
         "_id": ObjectID()
      },
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
         "svgTransform":"matrix(1.8201,3.7529,-3.7529,1.8201,1664.3,-1785.7)",
         "svgFill":"#4612c9",
         "_id": ObjectID()
      },
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
         "svgTransform":"matrix(-2.1332,3.5842,-3.5842,-2.1332,3051.5,358.96)",
         "svgFill":"#4612c9",
         "_id": ObjectID()
      },
      {
         "svgStrokeWidth":"0.39355",
         "svgStrokeMiterLimit":"2",
         "svgD":"m388.2 491.45c0 7.7128-6.2525 13.965-13.965 13.965-7.7129 0-13.965-6.2525-13.965-13.965 0-7.7129 6.2525-13.965 13.965-13.965 7.7128 0 13.965 6.2525 13.965 13.965z",
         "svgTransform":"matrix(7.6546,0,0,7.6546,-2501.9,-3188.1)",
         "svgFill":"#c21111",
         "_id": ObjectID()
      }
   ],
   "groupTransform":"translate(-119.87 -303.28)"
}
```


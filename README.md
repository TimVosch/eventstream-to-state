## Eventsourcing

This demo does not use a database to store entity states. However it reproduces the state of entities depending on what events occured. The events are kept in Kafka.

### Demo guide

Start Kafka and ZooKeeper:

```
docker-compose up -d
```

Start the demo application

```
yarn start
```

### Endpoints

The demo application has several endpoints:

#### Create a user

URL:

```
POST http://localhost:3000/users
```

Body:

```json
{
  "username": "SomeUsername"
}
```

#### Get a user

URL:

```
GET http://localhost:3000/users/<id>
```

#### Update a user its credit

URL:

```
POST http://localhost:3000/users/<id>/credit
```

Body:

```json
{
  "amount": -53
}
```

### Delete a user

URL:

```
DELETE http://localhost:3000/users/<id>
```

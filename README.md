## Project setup

```
npm install -g serverless
npm install
```

## Deploy

```
serverless deploy
serverless deploy function -f collectMovie --stage dev
serverless deploy function -f getVideo --stage dev

https://github.com/nordcloud/serverless-plugin-additional-stacks#command-line-usage
serverless deploy additionalstacks
serverless deploy additionalstacks --stack [stackname]
serverless deploy --skip-additionalstacks

```

## Remove resources

```
serverless remove
```

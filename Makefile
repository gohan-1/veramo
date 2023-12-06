include .env
clean:
	@echo "Stoping all Containers and pruning volume and system"
	-docker-compose stop
	-docker stop `docker ps -aq`
	-docker rm `docker ps -aq`
clean-image:
	-docker rmi earthid-appnet
prune-volume:
	-docker volume prune -f
	-sudo rm -rfv ../appdata
prune:
	@echo "Stoping all Containers and pruning volume system and images"
	-make clean
	-make clean-image
	-docker system prune -f
	-make prune-volume
build:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
	docker image prune --filter label=stage=builder -f
start:
	# make build
	# mkdir -p ../appdata/logs/issuer ../appdata/logs/verifier ../appdata/persistentData/issuer ../appdata/persistentData/verifier
ifeq ("${NODE_ENV}", "dev")
	make start-dev
else
	make start-prod
endif
testapp:
	@echo "Performing testing using Jest and Analyzing the report using Sonarqube"
	npm test
	-npm sonar
logs:
	docker-compose logs -f
start-dev:
	@echo "Starting Appnet in Development using Nodemon"
	docker-compose -f docker-compose-dynamolocal.yaml up -d
	#npm run start:dev
	 docker-compose up -d
start-prod:
	@echo "Starting Appnet in Production using Docker Containers"
	docker-compose up -d
jmeter:
	@echo "Performing load testing using Jmeter and Generating report"
ifeq (,$(findstring 'apache-jmeter-5.4.1',${JMETER_DIR}))
	"${JMETER_DIR}"/bin/jmeter -n -t ./public/test/jmeter/earthidssi-layer.jmx -l ./public/test/jmeter/reports/csv/earthidssi-layer-result.csv -e -o ./public/test/jmeter/reports/html -j ./public/test/jmeter/logs/jmeter.log
else
	@echo "Jmeter Directory is not set please set the directory in env for performing load testing"
endif

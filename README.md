# The Angular-Dropwizard generator 

A [Yeoman](http://yeoman.io) generator for [AngularJS](http://angularjs.org) and [Dropwizard](http://dropwizard.codahale.com).

## Installation

Install [node.js](http://nodejs.org).

Install Yeoman:

    npm install -g yo

Install the Angular-Dropwizard generator:

    npm install -g generator-angular-dropwizard

## Creating a Dropwizard service

Generate the service:

    yo angular-dropwizard

Compile the service:

    mvn compile

Run the service:

    mvn exec:exec -pl [myapp]-service

Your service will run at [http://localhost:8080](http://localhost:8080).  You will get an error that no root resource classes are running.  It's time to create some resources.

## Creating a resource class

Generate the resource:

    yo angular-dropwizard:resource [myresource]

You will be asked to specify methods for the resource, where each method has the following:

- a name
- a type (GET, POST, PUT, DELETE, HEAD)
- a URI path template, such as `/users/{userId}/orders/{orderId}`
- for a POST method, an optional list of form parameters

You can now invoke HTTP requests against your service, such as

	curl -X POST localhost:8080/myapp/myresource/users/1/orders/2 \
		 -d "formParam1=hello&formParam2=world"

## Creating a persistent entity

Generate the entity:

    yo angular-dropwizard:entity [myentity]

You will be asked to specify attributes for the entity, where each attribute has the following:

- a name
- a type (String, Integer, Long, Float, Double, Boolean, Date, Enum)
- for an Enum type, a list of enumerated values
- whether the attribute is required

A client-side AngularJS application will now be available by running

	grunt server
	
The Grunt server will run at [http://localhost:9000](http://localhost:9000).  It will proxy REST requests to the Dropwizard service running at [http://localhost:8080](http://localhost:8080).

At this point you should be able to navigate to a page to manage your persistent entities.  



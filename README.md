# The Angular-Dropwizard generator 

A [Yeoman](http://yeoman.io) generator for [AngularJS](http://angularjs.org) and [Dropwizard](http://dropwizard.codahale.com).

Dropwizard is a Java-based micro-framework.  For AngularJS integration with other micro-frameworks, see https://github.com/rayokota/MicroFrameworkRosettaStone.

## Installation

Install [Git](http://git-scm.com), [node.js](http://nodejs.org), [Maven](http://maven.apache.org/), and [Java 1.7](https://www.java.com).

Install Yeoman:

    npm install -g yo

Install the Angular-Dropwizard generator:

    npm install -g generator-angular-dropwizard

## Creating a Dropwizard service

In a new directory, generate the service:

    yo angular-dropwizard

Package the service:

    mvn package

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

Files that are regenerated will appear as conflicts.  Allow the generator to overwrite these files as long as no custom changes have been made.

Compile and rerun the service:

    mvn compile exec:exec -pl [myapp]-service
     
You can now invoke HTTP requests against your service, such as

	curl -X POST localhost:8080/myapp/myresource/users/1/orders/2 \
		 -d "formParam1=hello&formParam2=world"

## Creating a persistent entity

Generate the entity:

    yo angular-dropwizard:entity [myentity]

You will be asked to specify attributes for the entity, where each attribute has the following:

- a name
- a type (String, Integer, Long, Float, Double, Boolean, Date, Enum)
- for a String attribute, an optional minimum and maximum length
- for a numeric attribute, an optional minimum and maximum value
- for a Date attribute, an optional constraint to either past values or future values
- for an Enum attribute, a list of enumerated values
- whether the attribute is required

Compile and rerun the service:

    mvn compile exec:exec -pl [myapp]-service
    
A client-side AngularJS application will now be available by running

	grunt server
	
The Grunt server will run at [http://localhost:9000](http://localhost:9000).  It will proxy REST requests to the Dropwizard service running at [http://localhost:8080](http://localhost:8080).

At this point you should be able to navigate to a page to manage your persistent entities.  

The Grunt server supports hot reloading of client-side HTML/CSS/Javascript file changes, while the Dropwizard service supports hot reloading of Java class file changes.


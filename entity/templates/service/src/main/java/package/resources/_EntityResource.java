package <%= packageName %>.resources;

import <%= packageName %>.daos.<%= _.capitalize(name) %>DAO;
import <%= packageName %>.models.<%= _.capitalize(name) %>;
import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Optional;
import javax.ws.rs.NotFoundException;
import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.BooleanParam;
import io.dropwizard.jersey.params.DateTimeParam;
import io.dropwizard.jersey.params.IntParam;
import io.dropwizard.jersey.params.LongParam;
import org.hibernate.ObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/<%= pluralize(name) %>")
public class <%= _.capitalize(name) %>Resource {

    private static final Logger LOG = LoggerFactory.getLogger(<%= _.capitalize(name) %>Resource.class);

    private final <%= _.capitalize(name) %>DAO dao;

    public <%= _.capitalize(name) %>Resource(<%= _.capitalize(name) %>DAO dao) {
        this.dao = dao;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Timed 
    @UnitOfWork
    public <%= _.capitalize(name) %> create(<%= _.capitalize(name) %> entity) {
        return dao.save(entity);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Timed
    @UnitOfWork
    public List<<%= _.capitalize(name) %>> getAll() {
        return dao.findAll();
    }

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Timed
    @UnitOfWork
    public <%= _.capitalize(name) %> get(@PathParam("id") LongParam id) {
        Optional<<%= _.capitalize(name) %>> entity = dao.find(id.get());
        if (!entity.isPresent()) {
            throw new NotFoundException("<%= _.capitalize(name) %> " + id.get() + " not found");
        }
        return entity.get();
    }

    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Timed 
    @UnitOfWork
    public <%= _.capitalize(name) %> update(@PathParam("id") LongParam id, <%= _.capitalize(name) %> entity) {
        Optional<<%= _.capitalize(name) %>> ent = dao.find(id.get());
        if (!ent.isPresent()) {
            throw new NotFoundException("<%= _.capitalize(name) %> " + id.get() + " not found");
        }
        return dao.merge(entity);
    }

    @DELETE
    @Path("{id}")
    @Timed
    @UnitOfWork
    public void delete(@PathParam("id") LongParam id) {
        Optional<<%= _.capitalize(name) %>> entity = dao.find(id.get());
        if (!entity.isPresent()) {
            throw new NotFoundException("<%= _.capitalize(name) %> " + id.get() + " not found");
        }
        dao.delete(entity.get());
    }
}

package <%= packageName %>.daos;

import com.google.common.base.Optional;
import <%= packageName %>.models.<%= _.capitalize(name) %>;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;

import java.util.List;

/**
 * A DAO for managing {@link <%= _.capitalize(name) %>} objects.
 */
public class <%= _.capitalize(name) %>DAO extends AbstractDAO<<%= _.capitalize(name) %>> {

    /**
     * Creates a new DAO with the given session provider.
     *
     * @param provider a session provider
     */
    public <%= _.capitalize(name) %>DAO(SessionFactory provider) {
        super(provider);
    }

    /**
     * Returns the {@link <%= _.capitalize(name) %>} with the given ID.
     *
     * @param id the entity ID
     * @return the entity with the given ID
     */
    public Optional<<%= _.capitalize(name) %>> find(long id) {
        return Optional.fromNullable(get(id));
    }

    /**
     * Returns all {@link <%= _.capitalize(name) %>} entities.
     *
     * @return the list of entities
     */
    public List<<%= _.capitalize(name) %>> findAll() {
        return (List<<%= _.capitalize(name) %>>) criteria().list();
    }

    /**
     * Saves the given {@link <%= _.capitalize(name) %>}.
     *
     * @param entity the entity to save
     * @return the persistent entity
     */
    public <%= _.capitalize(name) %> save(<%= _.capitalize(name) %> entity) throws HibernateException {
        return persist(entity);
    }

    /**
     * Merges the given {@link <%= _.capitalize(name) %>}.
     *
     * @param entity the entity to merge
     * @return the persistent entity
     */
    public <%= _.capitalize(name) %> merge(<%= _.capitalize(name) %> entity) throws HibernateException {
        return (<%= _.capitalize(name) %>) currentSession().merge(entity);
    }

    /**
     * Deletes the given {@link <%= _.capitalize(name) %>}.
     *
     * @param entity the entity to delete
     */
    public void delete(<%= _.capitalize(name) %> entity) throws HibernateException {
        currentSession().delete(entity);
    }
}

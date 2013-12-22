package <%= packageName %>.model;

import javax.persistence.*;
import java.util.Objects;
import org.joda.time.DateTime;

@Entity
@Table(name = "<%= name %>")
public class <%= _.capitalize(name) %> {

    @Id
    @GeneratedValue
    private long id;

    <% _.each(attrs, function(attr) { %>
    @Column(name = "<%= attr.attrName %>")
    private <%= attr.attrType %> <%= attr.attrName %>;
    <% }); %>

    public long getId() {
        return id;
    }

    <% _.each(attrs, function(attr) { %>
    public <%= attr.attrType %> get<%= _.capitalize(attr.attrName) %>() {
        return <%= attr.attrName %>;
    }

    public void set<%= _.capitalize(attr.attrName) %>(<%= attr.attrType %> <%= attr.attrName %>) {
        this.<%= attr.attrName %> = <%= attr.attrName %>;
    }
    <% }); %>

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof <%= _.capitalize(name) %>)) return false;
        <%= _.capitalize(name) %> that = (<%= _.capitalize(name) %>) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

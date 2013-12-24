package <%= packageName %>.model;

import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.joda.time.LocalDate;

@Entity
@Table(name = "<%= name %>")
public class <%= _.capitalize(name) %> {

    @Id
    @GeneratedValue
    private long id;

    <% _.each(attrs, function (attr) { %>
    <% if (attr.required) { %>@NotNull<% }; %>
    @Column(name = "<%= attr.attrName %>")
    <% if (attr.attrType == 'Enum') { %>@Enumerated(EnumType.STRING)<% } %>
    private <% if (attr.attrType == 'Enum') { %><%= _.capitalize(attr.attrName) %><% } %><%= attr.attrType %> <%= attr.attrName %>;
    <% }); %>

    public long getId() {
        return id;
    }

    <% _.each(attrs, function (attr) { %>
    public <% if (attr.attrType === 'Enum') { %><%= _.capitalize(attr.attrName) %><% } %><%= attr.attrType %> get<%= _.capitalize(attr.attrName) %>() {
        return <%= attr.attrName %>;
    }

    public void set<%= _.capitalize(attr.attrName) %>(<% if (attr.attrType == 'Enum') { %><%= _.capitalize(attr.attrName) %><% } %><%= attr.attrType %> <%= attr.attrName %>) {
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

package <%= packageName %>.models;

import javax.persistence.*;
import javax.validation.constraints.*;
import org.joda.time.LocalDate;

@Entity
@Table(name = "<%= pluralize(name) %>")
public class <%= _.capitalize(name) %> {

    @Id
    @GeneratedValue
    private long id;

    <% _.each(attrs, function (attr) { %>
    <% if (attr.required) { %>@NotNull<% }; %>
    @Column(name = "<%= attr.attrName %>"<% if (attr.maxLength) { %>, length = <%= attr.maxLength %><% } %>)
    <% var delim = ''; if (attr.minLength || attr.maxLength) { %>@Size(<% if (attr.minLength) { delim = ', '; %>min = <%= attr.minLength %><% }; if (attr.maxLength) { %><%= delim %>max = <%= attr.maxLength %><% } %>)<% } %>
    <% if (attr.min) { %>@Min(value = <%= attr.min %>)<% } %>
    <% if (attr.max) { %>@Max(value = <%= attr.max %>)<% } %>
    <% if (attr.dateConstraint) { %>@<%= attr.dateConstraint %><% } %>
    <% if (attr.attrType == 'Enum') { %>@Enumerated(EnumType.STRING)<% } %>
    private <% if (attr.attrType == 'Enum') { %><%= _.capitalize(attr.attrName) %><% } else if (attr.attrType == 'Date') { %>Local<% }; %><%= attr.attrType %> <%= attr.attrName %>;
    <% }); %>

    public long getId() {
        return id;
    }

    <% _.each(attrs, function (attr) { %>
    public <% if (attr.attrType === 'Enum') { %><%= _.capitalize(attr.attrName) %><% } else if (attr.attrType == 'Date') { %>Local<% }; %><%= attr.attrType %> get<%= _.capitalize(attr.attrName) %>() {
        return <%= attr.attrName %>;
    }

    public void set<%= _.capitalize(attr.attrName) %>(<% if (attr.attrType == 'Enum') { %><%= _.capitalize(attr.attrName) %><% } else if (attr.attrType == 'Date') { %>Local<% }; %><%= attr.attrType %> <%= attr.attrName %>) {
        this.<%= attr.attrName %> = <%= attr.attrName %>;
    }
    <% }); %>

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof <%= _.capitalize(name) %>)) return false;
        <%= _.capitalize(name) %> that = (<%= _.capitalize(name) %>) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}

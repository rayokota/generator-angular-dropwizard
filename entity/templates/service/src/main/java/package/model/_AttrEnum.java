package <%= packageName %>.model;

public enum <%= _.capitalize(attr.attrName) %>Enum {
    <% var delim = ''; _.each(attr.enumValues, function (value) { %><%= delim %> <%= value %><% delim = ','; }); %>
}

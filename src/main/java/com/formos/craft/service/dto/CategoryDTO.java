package com.formos.craft.service.dto;

import com.formos.craft.domain.Category;

/**
 * A DTO representing a category.
 */
public class CategoryDTO {

    private Long id;
    private String name;
    private String description;

    public CategoryDTO() {}

    public CategoryDTO(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "CategoryDTO{" + "id=" + id + ", name='" + name + '\'' + ", description='" + description + '\'' + '}';
    }
}

package com.formos.craft.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A beer.
 */
@Entity
@Table(name = "beer")
public class Beer extends AbstractAuditingEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    private Manufacturer manufacturer;

    @ManyToOne
    private Category category;

    @Column(name = "price")
    private Double price;

    @Column(name = "description")
    private String description;

    public Beer() {}

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

    public Manufacturer getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(Manufacturer manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Beer)) {
            return false;
        }
        return id != null && id.equals(((Beer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "Beer{" +
            "id=" +
            id +
            ", name='" +
            name +
            '\'' +
            ", manufacturer=" +
            manufacturer +
            ", category=" +
            category +
            ", price=" +
            price +
            ", description='" +
            description +
            '\'' +
            '}'
        );
    }
}

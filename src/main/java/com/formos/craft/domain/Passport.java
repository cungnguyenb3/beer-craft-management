package com.formos.craft.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Passport.
 */
@Entity
@Table(name = "passport")
public class Passport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "addtion_time")
    private Instant addtionTime;

    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Member member;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "manufacturer" }, allowSetters = true)
    private Beer beer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Passport id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getAddtionTime() {
        return this.addtionTime;
    }

    public Passport addtionTime(Instant addtionTime) {
        this.setAddtionTime(addtionTime);
        return this;
    }

    public void setAddtionTime(Instant addtionTime) {
        this.addtionTime = addtionTime;
    }

    public Member getMember() {
        return this.member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Passport member(Member member) {
        this.setMember(member);
        return this;
    }

    public Beer getBeer() {
        return this.beer;
    }

    public void setBeer(Beer beer) {
        this.beer = beer;
    }

    public Passport beer(Beer beer) {
        this.setBeer(beer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Passport)) {
            return false;
        }
        return id != null && id.equals(((Passport) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Passport{" +
            "id=" + getId() +
            ", addtionTime='" + getAddtionTime() + "'" +
            "}";
    }
}

package com.formos.craft.domain;

import java.time.Instant;
import javax.persistence.*;

/**
 * A passport.
 */
@Entity
@Table(name = "passport")
public class Passport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "addition_time")
    private Instant additionTime;

    @ManyToOne
    private Beer beer;

    @ManyToOne
    private Member member;

    public Passport() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Beer getBeer() {
        return beer;
    }

    public void setBeer(Beer beer) {
        this.beer = beer;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}

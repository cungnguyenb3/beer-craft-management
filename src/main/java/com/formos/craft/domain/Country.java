package com.formos.craft.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A country.
 */
@Entity
@Table(name = "country")
public class Country extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_code")
    private Integer phoneCode;

    @Column(name = "country_code")
    private String code;

    @Column(name = "country_name")
    private String name;

    public Country() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPhoneCode() {
        return phoneCode;
    }

    public void setPhoneCode(Integer phoneCode) {
        this.phoneCode = phoneCode;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Country [id=" + id + ", phoneCode=" + phoneCode + ", code=" + code + ", name=" + name + "]";
    }
}

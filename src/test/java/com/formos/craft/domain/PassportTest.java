package com.formos.craft.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.formos.craft.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PassportTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Passport.class);
        Passport passport1 = new Passport();
        passport1.setId(1L);
        Passport passport2 = new Passport();
        passport2.setId(passport1.getId());
        assertThat(passport1).isEqualTo(passport2);
        passport2.setId(2L);
        assertThat(passport1).isNotEqualTo(passport2);
        passport1.setId(null);
        assertThat(passport1).isNotEqualTo(passport2);
    }
}

package com.formos.craft.service;

import com.formos.craft.domain.Passport;
import com.formos.craft.repository.PassportRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Passport}.
 */
@Service
@Transactional
public class PassportService {

    private final Logger log = LoggerFactory.getLogger(PassportService.class);

    private final PassportRepository passportRepository;

    public PassportService(PassportRepository passportRepository) {
        this.passportRepository = passportRepository;
    }

    /**
     * Save a passport.
     *
     * @param passport the entity to save.
     * @return the persisted entity.
     */
    public Passport save(Passport passport) {
        log.debug("Request to save Passport : {}", passport);
        return passportRepository.save(passport);
    }

    /**
     * Update a passport.
     *
     * @param passport the entity to save.
     * @return the persisted entity.
     */
    public Passport update(Passport passport) {
        log.debug("Request to save Passport : {}", passport);
        return passportRepository.save(passport);
    }

    /**
     * Partially update a passport.
     *
     * @param passport the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Passport> partialUpdate(Passport passport) {
        log.debug("Request to partially update Passport : {}", passport);

        return passportRepository
            .findById(passport.getId())
            .map(existingPassport -> {
                if (passport.getAdditionTime() != null) {
                    existingPassport.setAdditionTime(passport.getAdditionTime());
                }

                return existingPassport;
            })
            .map(passportRepository::save);
    }

    /**
     * Get all the passports.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Passport> findAll(Pageable pageable) {
        log.debug("Request to get all Passports");
        return passportRepository.findAll(pageable);
    }

    /**
     * Get one passport by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Passport> findOne(Long id) {
        log.debug("Request to get Passport : {}", id);
        return passportRepository.findById(id);
    }

    /**
     * Delete the passport by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Passport : {}", id);
        passportRepository.deleteById(id);
    }
}

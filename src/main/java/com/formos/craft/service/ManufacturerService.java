package com.formos.craft.service;

import com.formos.craft.domain.Manufacturer;
import com.formos.craft.repository.ManufacturerRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Manufacturer}.
 */
@Service
@Transactional
public class ManufacturerService {

    private final Logger log = LoggerFactory.getLogger(ManufacturerService.class);

    private final ManufacturerRepository manufacturerRepository;

    public ManufacturerService(ManufacturerRepository manufacturerRepository) {
        this.manufacturerRepository = manufacturerRepository;
    }

    /**
     * Save a manufacturer.
     *
     * @param manufacturer the entity to save.
     * @return the persisted entity.
     */
    public Manufacturer save(Manufacturer manufacturer) {
        log.debug("Request to save Manufacturer : {}", manufacturer);
        return manufacturerRepository.save(manufacturer);
    }

    /**
     * Update a manufacturer.
     *
     * @param manufacturer the entity to save.
     * @return the persisted entity.
     */
    public Manufacturer update(Manufacturer manufacturer) {
        log.debug("Request to save Manufacturer : {}", manufacturer);
        return manufacturerRepository.save(manufacturer);
    }

    /**
     * Partially update a manufacturer.
     *
     * @param manufacturer the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Manufacturer> partialUpdate(Manufacturer manufacturer) {
        log.debug("Request to partially update Manufacturer : {}", manufacturer);

        return manufacturerRepository
            .findById(manufacturer.getId())
            .map(existingManufacturer -> {
                if (manufacturer.getCompanyName() != null) {
                    existingManufacturer.setCompanyName(manufacturer.getCompanyName());
                }

                return existingManufacturer;
            })
            .map(manufacturerRepository::save);
    }

    /**
     * Get all the manufacturers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Manufacturer> findAll(Pageable pageable) {
        log.debug("Request to get all Manufacturers");
        return manufacturerRepository.findAll(pageable);
    }

    /**
     * Get one manufacturer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Manufacturer> findOne(Long id) {
        log.debug("Request to get Manufacturer : {}", id);
        return manufacturerRepository.findById(id);
    }

    /**
     * Delete the manufacturer by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Manufacturer : {}", id);
        manufacturerRepository.deleteById(id);
    }
}

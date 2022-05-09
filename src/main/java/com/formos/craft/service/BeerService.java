package com.formos.craft.service;

import com.formos.craft.domain.Beer;
import com.formos.craft.repository.BeerRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Beer}.
 */
@Service
@Transactional
public class BeerService {

    private final Logger log = LoggerFactory.getLogger(BeerService.class);

    private final BeerRepository beerRepository;

    public BeerService(BeerRepository beerRepository) {
        this.beerRepository = beerRepository;
    }

    /**
     * Save a beer.
     *
     * @param beer the entity to save.
     * @return the persisted entity.
     */
    public Beer save(Beer beer) {
        log.debug("Request to save Beer : {}", beer);
        return beerRepository.save(beer);
    }

    /**
     * Update a beer.
     *
     * @param beer the entity to save.
     * @return the persisted entity.
     */
    public Beer update(Beer beer) {
        log.debug("Request to save Beer : {}", beer);
        return beerRepository.save(beer);
    }

    /**
     * Partially update a beer.
     *
     * @param beer the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Beer> partialUpdate(Beer beer) {
        log.debug("Request to partially update Beer : {}", beer);

        return beerRepository
            .findById(beer.getId())
            .map(existingBeer -> {
                if (beer.getName() != null) {
                    existingBeer.setName(beer.getName());
                }
                if (beer.getDescription() != null) {
                    existingBeer.setDescription(beer.getDescription());
                }
                if (beer.getPrice() != null) {
                    existingBeer.setPrice(beer.getPrice());
                }
                if (beer.getImage() != null) {
                    existingBeer.setImage(beer.getImage());
                }
                if (beer.getImageContentType() != null) {
                    existingBeer.setImageContentType(beer.getImageContentType());
                }

                return existingBeer;
            })
            .map(beerRepository::save);
    }

    /**
     * Get all the beers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Beer> findAll(Pageable pageable) {
        log.debug("Request to get all Beers");
        return beerRepository.findAll(pageable);
    }

    /**
     * Get one beer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Beer> findOne(Long id) {
        log.debug("Request to get Beer : {}", id);
        return beerRepository.findById(id);
    }

    /**
     * Delete the beer by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Beer : {}", id);
        beerRepository.deleteById(id);
    }
}

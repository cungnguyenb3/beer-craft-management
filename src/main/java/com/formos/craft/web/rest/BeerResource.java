package com.formos.craft.web.rest;

import com.formos.craft.domain.Beer;
import com.formos.craft.repository.BeerRepository;
import com.formos.craft.service.BeerService;
import com.formos.craft.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.formos.craft.domain.Beer}.
 */
@RestController
@RequestMapping("/api")
public class BeerResource {

    private final Logger log = LoggerFactory.getLogger(BeerResource.class);

    private static final String ENTITY_NAME = "beer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BeerService beerService;

    private final BeerRepository beerRepository;

    public BeerResource(BeerService beerService, BeerRepository beerRepository) {
        this.beerService = beerService;
        this.beerRepository = beerRepository;
    }

    /**
     * {@code POST  /beers} : Create a new beer.
     *
     * @param beer the beer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new beer, or with status {@code 400 (Bad Request)} if the beer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/beers")
    public ResponseEntity<Beer> createBeer(@Valid @RequestBody Beer beer) throws URISyntaxException {
        log.debug("REST request to save Beer : {}", beer);
        if (beer.getId() != null) {
            throw new BadRequestAlertException("A new beer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Beer result = beerService.save(beer);
        return ResponseEntity
            .created(new URI("/api/beers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /beers/:id} : Updates an existing beer.
     *
     * @param id the id of the beer to save.
     * @param beer the beer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated beer,
     * or with status {@code 400 (Bad Request)} if the beer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the beer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/beers/{id}")
    public ResponseEntity<Beer> updateBeer(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Beer beer)
        throws URISyntaxException {
        log.debug("REST request to update Beer : {}, {}", id, beer);
        if (beer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, beer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!beerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Beer result = beerService.update(beer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, beer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /beers/:id} : Partial updates given fields of an existing beer, field will ignore if it is null
     *
     * @param id the id of the beer to save.
     * @param beer the beer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated beer,
     * or with status {@code 400 (Bad Request)} if the beer is not valid,
     * or with status {@code 404 (Not Found)} if the beer is not found,
     * or with status {@code 500 (Internal Server Error)} if the beer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/beers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Beer> partialUpdateBeer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Beer beer
    ) throws URISyntaxException {
        log.debug("REST request to partial update Beer partially : {}, {}", id, beer);
        if (beer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, beer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!beerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Beer> result = beerService.partialUpdate(beer);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, beer.getId().toString())
        );
    }

    /**
     * {@code GET  /beers} : get all the beers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of beers in body.
     */
    @GetMapping("/beers")
    public ResponseEntity<List<Beer>> getAllBeers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Beers");
        Page<Beer> page = beerService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /beers/:id} : get the "id" beer.
     *
     * @param id the id of the beer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the beer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/beers/{id}")
    public ResponseEntity<Beer> getBeer(@PathVariable Long id) {
        log.debug("REST request to get Beer : {}", id);
        Optional<Beer> beer = beerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(beer);
    }

    /**
     * {@code DELETE  /beers/:id} : delete the "id" beer.
     *
     * @param id the id of the beer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/beers/{id}")
    public ResponseEntity<Void> deleteBeer(@PathVariable Long id) {
        log.debug("REST request to delete Beer : {}", id);
        beerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

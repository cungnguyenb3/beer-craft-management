package com.formos.craft.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.formos.craft.IntegrationTest;
import com.formos.craft.domain.Beer;
import com.formos.craft.repository.BeerRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BeerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BeerResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final String ENTITY_API_URL = "/api/beers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BeerRepository beerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBeerMockMvc;

    private Beer beer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Beer createEntity(EntityManager em) {
        Beer beer = new Beer().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).price(DEFAULT_PRICE);
        return beer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Beer createUpdatedEntity(EntityManager em) {
        Beer beer = new Beer().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).price(UPDATED_PRICE);
        return beer;
    }

    @BeforeEach
    public void initTest() {
        beer = createEntity(em);
    }

    @Test
    @Transactional
    void createBeer() throws Exception {
        int databaseSizeBeforeCreate = beerRepository.findAll().size();
        // Create the Beer
        restBeerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(beer)))
            .andExpect(status().isCreated());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeCreate + 1);
        Beer testBeer = beerList.get(beerList.size() - 1);
        assertThat(testBeer.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBeer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBeer.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createBeerWithExistingId() throws Exception {
        // Create the Beer with an existing ID
        beer.setId(1L);

        int databaseSizeBeforeCreate = beerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBeerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(beer)))
            .andExpect(status().isBadRequest());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBeers() throws Exception {
        // Initialize the database
        beerRepository.saveAndFlush(beer);

        // Get all the beerList
        restBeerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(beer.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getBeer() throws Exception {
        // Initialize the database
        beerRepository.saveAndFlush(beer);

        // Get the beer
        restBeerMockMvc
            .perform(get(ENTITY_API_URL_ID, beer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(beer.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingBeer() throws Exception {
        // Get the beer
        restBeerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBeer() throws Exception {
        // Initialize the database
        beerRepository.saveAndFlush(beer);

        int databaseSizeBeforeUpdate = beerRepository.findAll().size();

        // Update the beer
        Beer updatedBeer = beerRepository.findById(beer.getId()).get();
        // Disconnect from session so that the updates on updatedBeer are not directly saved in db
        em.detach(updatedBeer);
        updatedBeer.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).price(UPDATED_PRICE);

        restBeerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBeer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBeer))
            )
            .andExpect(status().isOk());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
        Beer testBeer = beerList.get(beerList.size() - 1);
        assertThat(testBeer.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBeer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBeer.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingBeer() throws Exception {
        int databaseSizeBeforeUpdate = beerRepository.findAll().size();
        beer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBeerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, beer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(beer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBeer() throws Exception {
        int databaseSizeBeforeUpdate = beerRepository.findAll().size();
        beer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(beer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBeer() throws Exception {
        int databaseSizeBeforeUpdate = beerRepository.findAll().size();
        beer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(beer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBeerWithPatch() throws Exception {
        // Initialize the database
        beerRepository.saveAndFlush(beer);

        int databaseSizeBeforeUpdate = beerRepository.findAll().size();

        // Update the beer using partial update
        Beer partialUpdatedBeer = new Beer();
        partialUpdatedBeer.setId(beer.getId());

        partialUpdatedBeer.name(UPDATED_NAME);

        restBeerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBeer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBeer))
            )
            .andExpect(status().isOk());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
        Beer testBeer = beerList.get(beerList.size() - 1);
        assertThat(testBeer.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBeer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBeer.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateBeerWithPatch() throws Exception {
        // Initialize the database
        beerRepository.saveAndFlush(beer);

        int databaseSizeBeforeUpdate = beerRepository.findAll().size();

        // Update the beer using partial update
        Beer partialUpdatedBeer = new Beer();
        partialUpdatedBeer.setId(beer.getId());

        partialUpdatedBeer.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).price(UPDATED_PRICE);

        restBeerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBeer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBeer))
            )
            .andExpect(status().isOk());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
        Beer testBeer = beerList.get(beerList.size() - 1);
        assertThat(testBeer.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBeer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBeer.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingBeer() throws Exception {
        int databaseSizeBeforeUpdate = beerRepository.findAll().size();
        beer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBeerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, beer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(beer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBeer() throws Exception {
        int databaseSizeBeforeUpdate = beerRepository.findAll().size();
        beer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(beer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBeer() throws Exception {
        int databaseSizeBeforeUpdate = beerRepository.findAll().size();
        beer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(beer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Beer in the database
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBeer() throws Exception {
        // Initialize the database
        beerRepository.saveAndFlush(beer);

        int databaseSizeBeforeDelete = beerRepository.findAll().size();

        // Delete the beer
        restBeerMockMvc
            .perform(delete(ENTITY_API_URL_ID, beer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Beer> beerList = beerRepository.findAll();
        assertThat(beerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

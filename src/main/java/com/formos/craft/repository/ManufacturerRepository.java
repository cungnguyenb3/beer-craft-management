package com.formos.craft.repository;

import com.formos.craft.domain.Manufacturer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Manufacturer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {}

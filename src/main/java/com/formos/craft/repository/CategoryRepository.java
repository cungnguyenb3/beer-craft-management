package com.formos.craft.repository;

import com.formos.craft.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Category entity.
 */

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {}

/*
 * Copyright 2012-2025 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.samples.petclinic.owner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for {@link CallNoteController}
 *
 * @author PetClinic Team
 */
@WebMvcTest(CallNoteController.class)
@DisabledInNativeImage
@DisabledInAotMode
class CallNoteControllerTests {

	private static final int TEST_OWNER_ID = 1;

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private OwnerRepository owners;

	private Owner george() {
		Owner george = new Owner();
		george.setId(TEST_OWNER_ID);
		george.setFirstName("George");
		george.setLastName("Franklin");
		george.setAddress("110 W. Liberty St.");
		george.setCity("Madison");
		george.setTelephone("6085551023");
		return george;
	}

	@BeforeEach
	void setup() {
		given(this.owners.findById(TEST_OWNER_ID)).willReturn(Optional.of(george()));
	}

	@Test
	void initNewCallNoteForm() throws Exception {
		mockMvc.perform(get("/owners/{ownerId}/callnotes/new", TEST_OWNER_ID))
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("callNote"))
			.andExpect(model().attributeExists("owner"))
			.andExpect(view().name("owners/createOrUpdateCallNoteForm"));
	}

	@Test
	void processNewCallNoteFormSuccess() throws Exception {
		mockMvc
			.perform(post("/owners/{ownerId}/callnotes/new", TEST_OWNER_ID)
				.param("noteContent", "Called owner about upcoming appointment")
				.param("callReason", "Appointment reminder")
				.param("staffName", "Dr. Carter"))
			.andExpect(status().is3xxRedirection())
			.andExpect(view().name("redirect:/owners/{ownerId}"));
	}

	@Test
	void processNewCallNoteFormHasErrors() throws Exception {
		mockMvc.perform(post("/owners/{ownerId}/callnotes/new", TEST_OWNER_ID).param("noteContent", ""))
			.andExpect(status().isOk())
			.andExpect(model().attributeHasErrors("callNote"))
			.andExpect(model().attributeHasFieldErrors("callNote", "noteContent"))
			.andExpect(view().name("owners/createOrUpdateCallNoteForm"));
	}

}

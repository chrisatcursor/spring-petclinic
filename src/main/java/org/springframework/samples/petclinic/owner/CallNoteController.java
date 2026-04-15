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

import java.time.LocalDateTime;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;

/**
 * Controller for managing call notes for owners.
 *
 * @author PetClinic Team
 */
@Controller
class CallNoteController {

	private final OwnerRepository owners;

	public CallNoteController(OwnerRepository owners) {
		this.owners = owners;
	}

	@InitBinder
	public void setAllowedFields(WebDataBinder dataBinder) {
		dataBinder.setDisallowedFields("id");
	}

	@ModelAttribute("owner")
	public Owner findOwner(@PathVariable("ownerId") int ownerId) {
		return this.owners.findById(ownerId)
			.orElseThrow(() -> new IllegalArgumentException(
					"Owner not found with id: " + ownerId + ". Please ensure the ID is correct."));
	}

	@GetMapping("/owners/{ownerId}/callnotes/new")
	public String initNewCallNoteForm(Owner owner, java.util.Map<String, Object> model) {
		CallNote callNote = new CallNote();
		owner.addCallNote(callNote);
		model.put("callNote", callNote);
		return "owners/createOrUpdateCallNoteForm";
	}

	@PostMapping("/owners/{ownerId}/callnotes/new")
	public String processNewCallNoteForm(Owner owner, @Valid CallNote callNote, BindingResult result,
			RedirectAttributes redirectAttributes) {
		if (result.hasErrors()) {
			return "owners/createOrUpdateCallNoteForm";
		}

		if (callNote.getCallTimestamp() == null) {
			callNote.setCallTimestamp(LocalDateTime.now());
		}
		owner.addCallNote(callNote);
		this.owners.save(owner);
		redirectAttributes.addFlashAttribute("message", "Call note added successfully");
		return "redirect:/owners/{ownerId}";
	}

}

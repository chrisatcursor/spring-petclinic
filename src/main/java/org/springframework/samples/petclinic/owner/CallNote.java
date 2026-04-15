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

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Simple JavaBean domain object representing a note taken during a phone call with an
 * owner.
 *
 * @author PetClinic Team
 */
@Entity
@Table(name = "call_notes")
public class CallNote extends BaseEntity {

	@Column(name = "call_timestamp")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
	private LocalDateTime callTimestamp;

	@NotBlank
	@Size(max = 2000)
	@Column(name = "note_content", length = 2000)
	private String noteContent;

	@Size(max = 100)
	@Column(name = "call_reason", length = 100)
	private String callReason;

	@Size(max = 50)
	@Column(name = "staff_name", length = 50)
	private String staffName;

	public CallNote() {
		this.callTimestamp = LocalDateTime.now();
	}

	public LocalDateTime getCallTimestamp() {
		return this.callTimestamp;
	}

	public void setCallTimestamp(LocalDateTime callTimestamp) {
		this.callTimestamp = callTimestamp;
	}

	public String getNoteContent() {
		return this.noteContent;
	}

	public void setNoteContent(String noteContent) {
		this.noteContent = noteContent;
	}

	public String getCallReason() {
		return this.callReason;
	}

	public void setCallReason(String callReason) {
		this.callReason = callReason;
	}

	public String getStaffName() {
		return this.staffName;
	}

	public void setStaffName(String staffName) {
		this.staffName = staffName;
	}

}

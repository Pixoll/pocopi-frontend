# PoCoPI Configuration Documentation

This document explains how to configure the PoCoPI (Proof of Concept of Psycho-Informatics) application using the
[config.yaml](./config.yaml) file. The configuration defines the experiment structure, including forms, groups,
protocols, phases, and questions.

## Table of Contents

1. [Overview](#overview)
2. [Basic Structure](#basic-structure)
3. [Information Cards](#information-cards)
4. [Frequently Asked Questions](#frequently-asked-questions)
5. [Forms](#forms)
6. [Groups and Protocols](#groups-and-protocols)
7. [Phases](#phases)
8. [Questions](#questions)
9. [Images](#images)
10. [Additional Validation Rules](#additional-validation-rules)

## Overview

PoCoPI uses a YAML configuration file to define all aspects of the experiment. The configuration is validated against a
JSON schema and through additional runtime checks to ensure correctness.

## Basic Structure

The configuration file must include the following top-level properties:

```yaml
# The website's icon. See the Images section
icon: ...
# Basic information about the experiment
title: PoCoPI
# Optional subtitle
subtitle: The test making & taking platform.
# Required description - allows markdown
description: Proof of Concept of Psycho-Informatics.

# Optional information cards
informationCards:

# Required informed consent form text - allows markdown
informedConsent:

# Optional frequently asked questions section
faq:

# Optional pre-test and post-test forms
preTestForm:
  questions:
  # Form questions go here

postTestForm:
  questions:
  # Form questions go here

# Experiment groups with their protocols
groups:
# Groups go here

# Optional sections for reusing components
protocols:
# Reusable protocols go here
phases:
# Reusable phases go here
questions:
# Reusable questions go here
```

## Information Cards

Information cards are placed underneath the description of the website, and they're meant for small bits of information:

```yaml
informationCards:
  - title: Scientific purpose                         # Required
    description: >                                    # Required
      This test is part of academic research in the
      field of psychometrics.
    color: # Optional, must be an RGB color
      r: 13                                           # RGB value between 0 and 255 (inclusive)
      g: 110
      b: 253
    icon: # Optional icon. See the Images section
      src: flask.svg
      alt: Flask Icon
  # more cards...
```

## Frequently Asked Questions

These are displayed at the bottom of the website:

```yaml
faq:
  - question: Can I pause the test and continue later?   # Required
    answer: >                                            # Required
      It is recommended to complete the test without
       interruptions to obtain more accurate results.
  # more faqs...
```

## Forms

Forms are used for pre-test and post-test questionnaires. They contain a list of questions of various types:

### Form Question Types

#### 1. Multiple selection:

```yaml
- category: Demographic               # Required
  text: Multiple selection question   # Required
  image: ...                          # Optional question image. See the Images section
  type: select-multiple               # Required
  options: # Required. At least 2 items
    - text: Option 1                  # An option can have either text, image, or both
    - image: ...
    - text: Option 3
      image: ...
    # more options...
  min: 1                              # Minimum selections required
  max: 3                              # Maximum selections allowed
  other: true                         # Optional. Whether to add an "Other:" option at the end of the options list
```

#### 2. Single choice:

```yaml
- category: Demographic          # Required
  text: Single choice question   # Required
  image: ...                     # Optional question image. See the Images section
  type: select-one               # Required
  options: # Required. At least 2 items
    - text: Option 1             # An option can have either text, image, or both
    - image: ...
    - text: Option 3
      image: ...
    # more options...
  other: true                    # Optional. Whether to add an "Other:" option at the end of the options list
```

#### 3. Number input

```yaml
- category: GRIT-S           # Required
  text: Number input         # Required
  image: ...                 # Optional question image. See the Images section
  type: number               # Required
  placeholder: Answer here   # Required
  min: 1                     # Minimum value
  max: 2                     # Maximum value
  step: 0.1                  # Increment step. Must be greater than zero
```

#### 4. Slider

```yaml
- category: GRIT-S        # Required
  text: Slider question   # Required
  image: ...              # Optional question image. See the Images section
  type: slider            # Required
  min: 1                  # Minimum value
  max: 10                 # Maximum value
  step: 1                 # Step size. Must be greater than zero
  labels: # Optional labels
    1: Low
    10: High
```

#### 5. Short text

```yaml
- category: SRL               # Required
  text: Short text question   # Required
  image: ...                  # Optional question image. See the Images section
  type: text-short            # Required
  placeholder: Answer here    # Required
  minLength: 1                # Minimum text length
  maxLength: 50               # Maximum text length
```

#### 6. Long text

```yaml
- category: TPB              # Required
  text: Long text question   # Required
  image: ...                 # Optional question image. See the Images section
  type: text-long            # Required
  placeholder: Answer here   # Required
  minLength: 1               # Minimum text length
  maxLength: 400             # Maximum text length
```

## Groups and Protocols

Groups define different experimental conditions with assigned probabilities for participant allocation:

```yaml
groups:
  control:
    probability: 0.25   # 25% chance of selecting this group. Sum of all should be one
    protocol: control   # Reference to a protocol defined elsewhere

  groupA:
    probability: 0.25
    protocol: # Inline protocol definition
      phases:
        ...

  # More groups...
```

Protocols define the sequence of phases in an experiment:

```yaml
protocols:
  control:
    # Optional settings
    allowPreviousPhase: true   # Allow going back to previous phase (default true)
    allowSkipPhase: true       # Allow skipping phases (default true)
    randomize: false           # Randomize phase order (default false)
    # Required
    phases:
      - control-phase1         # Reference to a phase defined elsewhere
      - questions:             # Inline phase definition
        # Questions go here
```

## Phases

Phases are collections of questions presented together:

```yaml
phases:
  control-phase1:
    # Optional settings
    allowPreviousQuestion: true    # Allow going back to previous question (default true)
    allowSkipQuestion: true        # Allow skipping questions (default true)
    randomize: false               # Randomize question order (default false)
    # Required
    questions:
      - control-phase1-question1   # Reference to a question defined elsewhere
      - image: ...                 # Inline question definition
        # Question details...
```

## Questions

Questions can be defined inline or referenced by name:

```yaml
questions:
  control-phase1-question1:
    # Optional settings
    randomize: false      # Randomize options order (default false)
    # Required
    text: question text   # A question can have either text, image, or both
    image: ...
    options:
      - text: "1"         # An option can have either text, image, or both
      - image: ...
      - text: "3"
        image: ...
        correct: true     # Mark this option as correct. More than one (or none) can be marked as correct, but it will
#                         # cause a warning to be displayed on startup. If you intend to mark more than one (or none),
#                         # please ignore said warnings
```

## Images

Images are referenced by filename and require both `src` and `alt` attributes:

```yaml
image:
  src: example.webp        # Filename in the images/ directory. Any file extension is allowed 
  alt: Image description   # Description for accessibility
```

## Additional Validation Rules

Besides schema validation, the configuration is checked for:

1. **Group probabilities**:
    - The sum of all group probabilities must equal to 1

2. **Image validation**:
    - All referenced image files must exist in the images directory
    - The system warns about duplicate image usage

3. **Questions and options**:
    - Questions must have either text, image, or both
    - Options must have either text, image, or both
    - Each question should have exactly one correct option (warnings are issued otherwise)

4. **Form question validations**:
    - For number and slider questions: `min` must be less than `max`
    - For slider questions: all labels must be between `min` and `max` and divisible by `step`
    - For text questions: `minLength` must be less than `maxLength`

5. **Reference resolution**:
    - All referenced protocols, phases, and questions must exist in their respective sections

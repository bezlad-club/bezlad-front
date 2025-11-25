export const contactsPhoneRegex =
  /^\+38\s?\(?(\d{3})\)?\s?(\d{3})\s?(\d{2})\s?(\d{2})$/;

export const formPhoneRegex = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇґҐєЄ\s'"-]+$/;

export const emailRegex =
  /^([a-zA-Z0-9]+)([a-zA-Z0-9?'"`#$%&*+_./|^{}~]+)?@([a-zA-Z0-9_\-.]+)([.][a-zA-Z]{2,3})$/;

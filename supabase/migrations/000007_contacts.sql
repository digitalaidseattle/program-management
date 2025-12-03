CREATE TABLE profile2partner (
    profile_id uuid not null,
    partner_id uuid not null,
    title text,
    constraint profile2partner_pkey primary key (profile_id, partner_id),
    constraint profile2partner_profile_id_fkey foreign KEY (profile_id) references profile (id) on delete CASCADE,
    constraint profile2partner_partner_id_fkey foreign KEY (partner_id) references partner (id) on delete CASCADE
);
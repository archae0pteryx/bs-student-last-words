use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct StudentState {
    pub is_initialized: bool,
    pub name: String,
    pub message: String,
}

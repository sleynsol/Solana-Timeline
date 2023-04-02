use anchor_lang::prelude::*;


declare_id!("pYSi8uuoAZPNNzk76aWax5NscjACtJtSDY9DSGnQtWB");

#[program]
pub mod msg3_program {

    use anchor_lang::solana_program::log;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global = &mut ctx.accounts.global;

        global.global_post_count = 0;
        global.global_user_count = 0;
        global.category_count = 0;
        global.last_category_pda = ctx.program_id.key();
        global.last_user = ctx.program_id.key();
        global.bump = *ctx.bumps.get("global").unwrap();
        Ok(())
    }


    pub fn create_category(ctx: Context<CreateCategory>, name: String) -> Result<()> {
        let global = &mut ctx.accounts.global;
        let category = &mut ctx.accounts.category;

        
        if name.as_bytes().len() < 1 {
            panic!("Name too short, increase to 1.")
        }

        if name.as_bytes().len() > 20 {
            panic!("Name too long, reduce to 20.")
        }

        category.name = name;
        category.creator = ctx.accounts.creator.key();
        category.post_count = 0;
        category.predecessor = global.last_category_pda;
        category.bump = *ctx.bumps.get("category").unwrap();

        global.category_count += 1;
        global.last_category_pda = category.key();

        Ok(())
    }

    pub fn post(ctx: Context<CreatePost>, text: String) -> Result<()> {
        let global = &mut ctx.accounts.global;
        let category = &mut ctx.accounts.category;
        let post = &mut ctx.accounts.post;
        let user = &mut ctx.accounts.user;

        if text.as_bytes().len() > 200 {
            panic!("Text too long, reduce to 200.")
        }

        post.text = text;
        post.likes = 0;
        post.predecessor = category.last_post_pda;
        post.writer = ctx.accounts.creator.key();
        post.bump = *ctx.bumps.get("post").unwrap();

        category.last_post_pda = post.key();

        user.post_count += 1;
        category.post_count += 1;
        global.global_post_count += 1;


        Ok(())
    }

    pub fn comment(ctx: Context<CreateComment>, text: String) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let comment = &mut ctx.accounts.comment;
        let user = &mut ctx.accounts.user;

        if text.as_bytes().len() > 200 {
            panic!("Text too long, reduce to 200.")
        }

        comment.text = text;
        comment.likes = 0;
        comment.predecessor = post.last_comment_pda;
        comment.writer = ctx.accounts.creator.key();
        comment.bump = *ctx.bumps.get("comment").unwrap();

        post.last_comment_pda = comment.key();

        post.comments += 1;
        user.comment_count += 1;
        
        Ok(())
    }


    pub fn like_post(ctx: Context<LikePost>) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let like = &mut ctx.accounts.like;

        post.likes += 1;
        like.bump = *ctx.bumps.get("like").unwrap();

        Ok(())
    }

    pub fn like_comment(ctx: Context<LikeComment>) -> Result<()> {
        let comment = &mut ctx.accounts.comment;
        let like = &mut ctx.accounts.like;

        comment.likes += 1;
        like.bump = *ctx.bumps.get("like").unwrap();

        Ok(())
    }



    pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
        let global = &mut ctx.accounts.global;
        let creator = &mut ctx.accounts.creator;
        let user = &mut ctx.accounts.user;

        user.pubkey = creator.key();
        user.post_count = 0;
        user.predecessor = global.last_user;
        user.bump = *ctx.bumps.get("user").unwrap();

        global.last_user = user.key();
        global.global_user_count += 1;

        Ok(())
    }

}


#[derive(Accounts)]
pub struct Initialize<'info> {

    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + GlobalStats::MAX_SIZE, seeds = [b"global"], bump
    )]
    pub global: Account<'info, GlobalStats>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateCategory<'info> {

    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Category::MAX_SIZE, seeds = [b"category", name.as_bytes()], bump
    )]
    pub category: Account<'info, Category>,

    #[account(
        mut,
        seeds = [b"global"], bump = global.bump
    )]
    pub global: Account<'info, GlobalStats>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreatePost<'info> {

    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Post::MAX_SIZE, seeds = [b"post", user.key().as_ref(), &user.post_count.to_be_bytes()], bump
    )]
    pub post: Account<'info, Post>,

    #[account(
        mut,
        seeds = [b"user", creator.key().as_ref()], bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [b"category", category.name.as_bytes()], bump = category.bump
    )]
    pub category: Account<'info, Category>,

    #[account(
        mut,
        seeds = [b"global"], bump = global.bump
    )]
    pub global: Account<'info, GlobalStats>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct LikePost<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Like::MAX_SIZE, seeds = [b"like", user.key().as_ref(), post.key().as_ref()], bump
    )]
    pub like: Account<'info, Like>,


    #[account(
        mut,
        seeds = [b"user", creator.key().as_ref()], bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub post: Account<'info, Post>,

    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct LikeComment<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Like::MAX_SIZE, seeds = [b"like", user.key().as_ref(), comment.key().as_ref()], bump
    )]
    pub like: Account<'info, Like>,


    #[account(
        mut,
        seeds = [b"user", creator.key().as_ref()], bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub comment: Account<'info, Comment>,

    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct CreateComment<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Comment::MAX_SIZE, seeds = [b"comment", user.key().as_ref(), &user.comment_count.to_be_bytes()], bump
    )]
    pub comment: Account<'info, Comment>,

    #[account(
        mut,
        seeds = [b"user", creator.key().as_ref()], bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub post: Account<'info, Post>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + User::MAX_SIZE, seeds = [b"user", creator.key().as_ref()], bump
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [b"global"], bump = global.bump
    )]
    pub global: Account<'info, GlobalStats>,
    pub system_program: Program<'info, System>
}


#[account]
pub struct GlobalStats {
    global_post_count: u128,
    global_user_count: u128,
    category_count: u64,
    last_user: Pubkey,
    last_category_pda: Pubkey,
    bump: u8
}

impl GlobalStats {
    pub const MAX_SIZE: usize = 16 + 16 + 8 + 32 + 32 + 1;
}

#[account]
pub struct User {
    post_count: u64,
    comment_count: u64,
    predecessor: Pubkey,
    pubkey: Pubkey,
    bump: u8
}

impl User {
    pub const MAX_SIZE: usize = 8 + 8 + 32 + 32 + 1;
}

#[account]
pub struct Category {
    name: String,
    post_count: u64,
    last_post_pda: Pubkey,
    predecessor: Pubkey,
    creator: Pubkey,
    bump: u8
}

impl Category {
    pub const MAX_SIZE: usize = (4 + 20) + 8 + 32 + 32 + 32 + 1;
}

#[account]
pub struct Post {
    text: String,
    likes: u64,
    comments: u64,
    last_comment_pda: Pubkey,
    predecessor: Pubkey,
    writer: Pubkey,
    bump: u8
}

impl Post {
    pub const MAX_SIZE: usize = (4 + 200) + 8 + 8 + 32 + 32 + 32 + 1;
}

#[account]
pub struct Like {
    bump: u8
}

impl Like {
    pub const MAX_SIZE: usize = 1;
}

#[account]
pub struct Comment {
    text: String,
    likes: u64,
    predecessor: Pubkey,
    writer: Pubkey,
    bump: u8
}

impl Comment {
    pub const MAX_SIZE: usize = (4 + 200) + 8 + 32 + 32 + 1;
}
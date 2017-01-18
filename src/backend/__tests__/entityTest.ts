

export const entityTest = (knex) => {
    it('test', async () => {
      const result = await knex.select().from('entities');
      chai.expect(result.length).to.equal(3);
    });
};

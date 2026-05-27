# Sample Prompts

## Seed Prompt

[Seed Prompt](./seed.md)

## MicroSim UI Cleanup Prompt

!!! prompt
    Please go through all the Microsims in @docs/sims/* and check the status field in the index.md header metadata.  
    For each MicroSim that does NOT have the status 'approved' (status: approved) please run the /microsim-layout-reviewer and if there are errors continue to use the        
    /microsim-generator to fix them.
    
    Also make sure that the description field for ALL the microsims has quotes around the field.               
 